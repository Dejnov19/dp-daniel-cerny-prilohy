Attribute VB_Name = "recolor_v02"
Sub recolor_v02()

    Dim d As Document
    Dim s As Shape
    Dim barva As Color
    Dim r As Long, g As Long, b As Long
    Dim i As Long, pocet As Long
    Dim jePovolena As Boolean

    ' Povolené barvy (ty se nemìní)
    Dim seznamBarev As Variant
    seznamBarev = Array( _
        Array(0, 0, 0), _
        Array(162, 43, 22))

    Set d = ActiveDocument
    On Error GoTo SafeExit

    ' --- ZAÈÁTEK JEDNOHO UNDO KROKU ---
    d.BeginCommandGroup "Recolor shapes"

    pocet = 0

    For Each s In ActivePage.Shapes
        If s.Type = cdrCurveShape Then
            If s.Outline.Type <> cdrNoOutline Then
                Set barva = s.Outline.Color
                If barva.Type = cdrColorRGB Then
                    r = barva.RGBRed: g = barva.RGBGreen: b = barva.RGBBlue

                    jePovolena = False
                    For i = LBound(seznamBarev) To UBound(seznamBarev)
                        If r = seznamBarev(i)(0) And g = seznamBarev(i)(1) And b = seznamBarev(i)(2) Then
                            jePovolena = True
                            Exit For
                        End If
                    Next i

                    If Not jePovolena Then
                        ' použije aktuální barvu obrysu jako výplò
                        s.Fill.UniformColor.RGBAssign r, g, b
                        s.Outline.Type = cdrNoOutline
                        pocet = pocet + 1
                    End If
                End If
            End If
        End If
    Next s

SafeExit:
    ' --- KONEC JEDNOHO UNDO KROKU ---
    On Error Resume Next
    d.EndCommandGroup
    On Error GoTo 0

    MsgBox pocet & " køivek bylo pøebarveno (ostatní barvy ponechány)."

End Sub


